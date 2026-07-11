# HappyRobot Setup

## Verified platform workflow

The supplied export contains a published 15-node inbound-call workflow named Sofia, Atlas Travel Concierge. It already performs qualification, extraction, routing, and follow-up selection.

## Required completion work

Keep the existing workflow and complete it so that it:

1. Receives an inbound lead interaction.
2. Ask adaptive qualification questions.
3. Store structured lead state and conversation history.
4. Score the lead and select the next action.
5. Follow up on the appropriate channel.
6. Escalate to a human when confidence or policy requires it.
7. Complete a measurable outcome such as a meeting booking.
8. Publishes an aggregated dashboard payload to a real endpoint.

Replace these current placeholders before a live demo:

- `maria@atlastravel.example`
- `https://webhook.site/replace-me-with-mission-control-url`
- `https://webhook.site/replace-me-with-callback-scheduler`
- `https://cal.com/atlas-travel/maria-consult`

## Expected dashboard payload

The live endpoint must return the fields validated by `lib/happyrobot-dashboard-schema.ts`:

```json
{
  "leads": [],
  "itineraries": [],
  "transcript": [],
  "whisperPrompts": [],
  "clientProfiles": [],
  "source": "happyrobot"
}
```

Use the mock data in `lib/mock-data.ts` as concrete examples of each record shape.

## Recommended workflow state

For each lead, persist:

- identity and consent status
- active channel and available fallback channels
- qualification answers and missing fields
- lead score and score reasons
- current pipeline stage
- next action and due time
- objections and responses tried
- assigned AI agent or human owner
- meeting, sale, or collection outcome
- trace entries for every decision and tool call

## Verification checklist

- Start an inbound and an outbound conversation.
- Continue the same lead on a second channel without losing context.
- Show at least one dynamic qualification branch.
- Show a timed follow-up selected by the agent.
- Show a human takeover and clean handback.
- Complete a booking or other concrete goal.
- Confirm dashboard state changes after each event.
- Confirm secrets never appear in browser requests or logs.
