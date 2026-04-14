

## Plan : Corriger la double création de tâches

### Problème
Le bouton "Créer" peut être cliqué deux fois rapidement, ce qui appelle `handleCreate` deux fois et crée deux tâches identiques dans la base de données (visible dans les logs réseau : deux POST distincts avec des IDs différents).

### Solution
Ajouter un état `isCreating` (boolean) pour désactiver le bouton pendant la création, dans les deux composants concernés.

### Fichiers à modifier

**1. `src/components/project/PlanStepTasks.tsx`**
- Ajouter `const [isCreating, setIsCreating] = useState(false)`
- Mettre `setIsCreating(true)` au début de `handleCreate`, `setIsCreating(false)` dans un `finally`
- Ajouter `disabled={isCreating || !title.trim()}` sur le bouton "Créer"

**2. `src/components/project/ProjectTasks.tsx`**
- Même modification : état `isCreating` + désactivation du bouton pendant l'appel

