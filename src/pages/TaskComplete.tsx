import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Trash2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Basse', medium: 'Moyenne', high: 'Haute', urgent: 'Urgente',
};
const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700', medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700', urgent: 'bg-red-100 text-red-700',
};

interface TaskInfo {
  id: string;
  title: string;
  description: string;
  project_id: string;
  priority: string;
  due_date: string;
  status: string;
}

interface Resource {
  id: string;
  label: string;
  url: string;
  note: string;
}

export default function TaskComplete() {
  const { token } = useParams<{ token: string }>();
  const [task, setTask] = useState<TaskInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNote, setNewNote] = useState('');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    if (!token) return;
    fetch(`${supabaseUrl}/functions/v1/complete-task?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setTask(data.task);
      })
      .catch(() => setError('Impossible de charger la tâche'))
      .finally(() => setLoading(false));
  }, [token, supabaseUrl]);

  const addResource = () => {
    if (!newLabel.trim()) return;
    setResources(prev => [...prev, { id: crypto.randomUUID(), label: newLabel.trim(), url: newUrl.trim(), note: newNote.trim() }]);
    setNewLabel(''); setNewUrl(''); setNewNote('');
  };

  const removeResource = (id: string) => setResources(prev => prev.filter(r => r.id !== id));

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/complete-task?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resources, message }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSubmitted(true);
    } catch {
      setError('Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Tâche accomplie ! 🎉</h2>
            <p className="text-green-600">Vos ressources ont été enregistrées. L'équipe a été notifiée.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) return null;

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Non définie';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">📋 Compléter une tâche</h1>
          <p className="text-slate-500 mt-1">Marquez cette tâche comme terminée et ajoutez vos ressources</p>
        </div>

        {/* Task info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {task.description && <p className="text-sm text-slate-600 whitespace-pre-wrap">{task.description}</p>}
            <div className="flex gap-3 flex-wrap">
              <Badge className={PRIORITY_COLORS[task.priority] || 'bg-gray-100'}>{PRIORITY_LABELS[task.priority] || task.priority}</Badge>
              <Badge variant="outline">📅 {formattedDate}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Resources form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📎 Ressources liées à votre travail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resources.length > 0 && (
              <div className="space-y-2">
                {resources.map(res => (
                  <div key={res.id} className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{res.label}</p>
                      {res.url && (
                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                          <ExternalLink className="h-3 w-3" />{res.url}
                        </a>
                      )}
                      {res.note && <p className="text-xs text-slate-500 mt-1">{res.note}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeResource(res.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border rounded-lg p-3 space-y-3 bg-white">
              <div><Label>Titre de la ressource</Label><Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Ex: Maquette Figma, Article de blog..." /></div>
              <div><Label>Lien (optionnel)</Label><Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." /></div>
              <div><Label>Note (optionnel)</Label><Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Détails supplémentaires..." className="min-h-[60px]" /></div>
              <Button size="sm" variant="outline" onClick={addResource} disabled={!newLabel.trim()}>
                <Plus className="h-4 w-4 mr-1" />Ajouter la ressource
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💬 Message (optionnel)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Un commentaire pour l'équipe..." className="min-h-[80px]" />
          </CardContent>
        </Card>

        {/* Submit */}
        <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
          Valider — Tâche accomplie
        </Button>
      </div>
    </div>
  );
}
