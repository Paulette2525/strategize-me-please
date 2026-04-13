const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { to, taskTitle, taskDescription, taskPriority, taskDueDate, projectName } = await req.json()

    if (!to || !taskTitle) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, taskTitle' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const priorityLabel = PRIORITY_LABELS[taskPriority] || taskPriority
    const formattedDate = taskDueDate
      ? new Date(taskDueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Non définie'

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#3b82f6,#7c3aed);padding:32px 40px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;">📋 Nouvelle tâche assignée</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Projet</p>
            <p style="margin:0 0 24px;color:#1e293b;font-size:16px;font-weight:600;">${projectName || 'Non spécifié'}</p>

            <h2 style="margin:0 0 16px;color:#1e293b;font-size:20px;">${taskTitle}</h2>

            ${taskDescription ? `<p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;white-space:pre-wrap;">${taskDescription}</p>` : ''}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;background-color:#f8fafc;border-radius:8px 0 0 8px;border-right:1px solid #e2e8f0;">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;">Priorité</p>
                  <p style="margin:0;color:#1e293b;font-size:14px;font-weight:600;">${priorityLabel}</p>
                </td>
                <td style="padding:12px 16px;background-color:#f8fafc;border-radius:0 8px 8px 0;">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;">Échéance</p>
                  <p style="margin:0;color:#1e293b;font-size:14px;font-weight:600;">${formattedDate}</p>
                </td>
              </tr>
            </table>

            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">Cet email a été envoyé automatiquement par Nodie Academy.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Nodie Academy <noreplay@elyostalent.com>',
        to: [to],
        subject: `Nouvelle tâche assignée : ${taskTitle}`,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Resend API error [${response.status}]: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
