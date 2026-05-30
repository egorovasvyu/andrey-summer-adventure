update public.app_state_documents
set
  state =
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    state,
                    '{totalXp}',
                    '200'::jsonb
                  ),
                  '{todayXp}',
                  '0'::jsonb
                ),
                '{survivedNights}',
                '5'::jsonb
              ),
              '{currentStreak}',
              '5'::jsonb
            ),
            '{night}',
            '5'::jsonb
          ),
          '{manualSurvived}',
          'false'::jsonb
        ),
        '{dayNotCounted}',
        'false'::jsonb
      ),
      '{calendarStatuses}',
      (state->'calendarStatuses')
        || '{"2026-05-25":"survived","2026-05-26":"survived","2026-05-27":"survived","2026-05-28":"survived","2026-05-29":"survived"}'::jsonb
    ),
  updated_at = now()
where family_key = 'andrey-family';
