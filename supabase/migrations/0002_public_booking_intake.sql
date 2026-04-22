create or replace function public.submit_booking_request(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  trip_type_value text := nullif(btrim(coalesce(payload->>'trip_type', '')), '');
  pickup_date_value date;
  pickup_time_value time;
  return_date_value date;
  return_time_value time;
  pickup_value text := nullif(btrim(coalesce(payload->>'pickup', '')), '');
  dropoff_value text := nullif(btrim(coalesce(payload->>'dropoff', '')), '');
  passenger_count_value integer;
  child_seats_value integer := 0;
  customer_name_value text := nullif(btrim(coalesce(payload->>'name', '')), '');
  customer_phone_value text := nullif(btrim(coalesce(payload->>'phone', '')), '');
  customer_email_value text := nullif(lower(btrim(coalesce(payload->>'email', ''))), '');
  language_value text := coalesce(nullif(lower(btrim(coalesce(payload->>'language', ''))), ''), 'en');
  customer_id_value uuid;
  booking_id_value uuid;
begin
  if jsonb_typeof(payload) is distinct from 'object' then
    raise exception 'payload must be a JSON object';
  end if;

  if trip_type_value not in ('oneway', 'roundtrip') then
    raise exception 'trip_type must be oneway or roundtrip';
  end if;

  if pickup_value is null or dropoff_value is null then
    raise exception 'pickup and dropoff are required';
  end if;

  if customer_name_value is null or customer_phone_value is null or customer_email_value is null then
    raise exception 'name, phone, and email are required';
  end if;

  pickup_date_value := (payload->>'pickup_date')::date;
  pickup_time_value := (payload->>'pickup_time')::time;

  if pickup_date_value is null or pickup_time_value is null then
    raise exception 'pickup_date and pickup_time are required';
  end if;

  passenger_count_value := coalesce(nullif(payload->>'passengers', '')::integer, 0);
  if passenger_count_value < 1 or passenger_count_value > 60 then
    raise exception 'passengers must be between 1 and 60';
  end if;

  child_seats_value := coalesce(nullif(payload->>'child_seats', '')::integer, 0);
  if child_seats_value < 0 or child_seats_value > 6 then
    raise exception 'child_seats must be between 0 and 6';
  end if;

  if trip_type_value = 'roundtrip' then
    return_date_value := (payload->>'return_date')::date;
    return_time_value := (payload->>'return_time')::time;

    if return_date_value is null or return_time_value is null then
      raise exception 'return_date and return_time are required for roundtrip bookings';
    end if;

    if return_date_value < pickup_date_value then
      raise exception 'return_date must be on or after pickup_date';
    end if;

    if return_date_value = pickup_date_value and return_time_value < pickup_time_value then
      raise exception 'return_time must be after pickup_time when the return date matches the pickup date';
    end if;
  end if;

  if customer_email_value is not null then
    select id
    into customer_id_value
    from customers
    where lower(email) = customer_email_value
    order by updated_at desc, created_at desc
    limit 1;
  end if;

  if customer_id_value is null and customer_phone_value is not null then
    select id
    into customer_id_value
    from customers
    where phone = customer_phone_value
    order by updated_at desc, created_at desc
    limit 1;
  end if;

  if customer_id_value is null then
    insert into customers (name, email, phone, language)
    values (customer_name_value, customer_email_value, customer_phone_value, language_value)
    returning id into customer_id_value;
  else
    update customers
    set
      name = customer_name_value,
      email = customer_email_value,
      phone = customer_phone_value,
      language = language_value,
      updated_at = now()
    where id = customer_id_value;
  end if;

  insert into booking_requests (
    customer_id,
    status,
    trip_type,
    pickup_date,
    pickup_time,
    return_date,
    return_time,
    pickup,
    dropoff,
    passenger_count,
    luggage,
    vehicle_preference,
    flight_number,
    child_seats,
    customer_name,
    customer_phone,
    customer_email,
    notes,
    language,
    page,
    url,
    utm,
    route_key,
    service_key,
    program_key,
    source_page,
    payload,
    internal_estimate_status
  )
  values (
    customer_id_value,
    'new',
    trip_type_value,
    pickup_date_value,
    pickup_time_value,
    return_date_value,
    return_time_value,
    pickup_value,
    dropoff_value,
    passenger_count_value,
    nullif(btrim(coalesce(payload->>'luggage', '')), ''),
    nullif(btrim(coalesce(payload->>'vehicle', '')), ''),
    nullif(btrim(coalesce(payload->>'flight_number', '')), ''),
    child_seats_value,
    customer_name_value,
    customer_phone_value,
    customer_email_value,
    nullif(btrim(coalesce(payload->>'notes', '')), ''),
    language_value,
    nullif(btrim(coalesce(payload->>'page', '')), ''),
    nullif(btrim(coalesce(payload->>'url', '')), ''),
    nullif(btrim(coalesce(payload->>'utm', '')), ''),
    nullif(btrim(coalesce(payload->>'route', '')), ''),
    nullif(btrim(coalesce(payload->>'service', '')), ''),
    nullif(btrim(coalesce(payload->>'program', '')), ''),
    nullif(btrim(coalesce(payload->>'source_page', '')), ''),
    payload,
    'manual_review'
  )
  returning id into booking_id_value;

  insert into booking_events (booking_request_id, event_type, payload)
  values (
    booking_id_value,
    'submitted_public',
    jsonb_build_object(
      'language', language_value,
      'page', nullif(btrim(coalesce(payload->>'page', '')), ''),
      'source_page', nullif(btrim(coalesce(payload->>'source_page', '')), ''),
      'route', nullif(btrim(coalesce(payload->>'route', '')), ''),
      'service', nullif(btrim(coalesce(payload->>'service', '')), ''),
      'program', nullif(btrim(coalesce(payload->>'program', '')), '')
    )
  );

  return jsonb_build_object(
    'id', booking_id_value,
    'status', 'received'
  );
end;
$$;

revoke all on function public.submit_booking_request(jsonb) from public;
grant execute on function public.submit_booking_request(jsonb) to anon, authenticated;
