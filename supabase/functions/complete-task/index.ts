import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token manquant' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET: fetch task info
    if (req.method === 'GET') {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('id, title, description, project_id, priority, due_date, status, completed_resources')
        .eq('completion_token', token)
        .single()

      if (error || !task) {
        return new Response(JSON.stringify({ error: 'Tâche introuvable ou token invalide' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ task }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST: mark task as done + add resources
    if (req.method === 'POST') {
      const { resources, message } = await req.json()

      // Find task by token
      const { data: task, error: findError } = await supabase
        .from('tasks')
        .select('id, status')
        .eq('completion_token', token)
        .single()

      if (findError || !task) {
        return new Response(JSON.stringify({ error: 'Tâche introuvable ou token invalide' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (task.status === 'done') {
        return new Response(JSON.stringify({ error: 'Cette tâche est déjà marquée comme terminée' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Update task status and add completed resources
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: 'done',
          completed_resources: resources || [],
          notes: message ? `[Commentaire du collaborateur] ${message}` : undefined,
        })
        .eq('id', task.id)

      if (updateError) {
        throw new Error(`Update error: ${JSON.stringify(updateError)}`)
      }

      // Record completion
      await supabase.from('task_completions').insert({
        task_id: task.id,
        token,
        resources: resources || [],
        message: message || '',
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
