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
                  state,
                  '{todayXp}',
                  '0'::jsonb
                ),
                '{manualSurvived}',
                'false'::jsonb
              ),
              '{dayNotCounted}',
              'false'::jsonb
            ),
            '{returnedToTrail}',
            'false'::jsonb
          ),
          '{dailyResetVersion}',
          '3'::jsonb
        ),
        '{missions}',
        (
          select jsonb_agg(
            case
              when mission ? 'done' then jsonb_set(mission, '{done}', 'false'::jsonb)
              else mission
            end
          )
          from jsonb_array_elements(state->'missions') as mission
        )
      ),
      '{currentDate}',
      to_jsonb(to_char(current_date, 'YYYY-MM-DD'))
    ),
  updated_at = now()
where family_key = 'andrey-family';

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
                  state,
                  '{totalXp}',
                  '200'::jsonb
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
          '{calendarStatuses}',
          (state->'calendarStatuses')
            || '{"2026-05-25":"survived","2026-05-26":"survived","2026-05-27":"survived","2026-05-28":"survived","2026-05-29":"survived"}'::jsonb
        ),
        '{todayXp}',
        '0'::jsonb
      ),
      '{manualSurvived}',
      'false'::jsonb
    ),
  updated_at = now()
where family_key = 'andrey-family';
