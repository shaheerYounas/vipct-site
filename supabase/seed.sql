insert into site_settings (key, value) values
('company', '{"company":"VIP Coach Transfers s.r.o.","email":"info@vipct.org","phone":"+420 775 091 730","whatsappNumber":"420775091730","address":"Moulikova 2240/5, 150 00 Praha","ico":"23693592","vat":"CZ23693592"}')
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into vehicles (display_name, vehicle_type, seats, luggage_capacity, status) values
('Luxury Sedan', 'sedan', 3, '2-3 bags', 'active'),
('Mercedes V-Class', 'v-class', 7, '5-7 bags', 'active'),
('Luxury Minibus', 'minibus', 20, '10-20 bags', 'active'),
('Executive Coach', 'coach', 60, 'Large luggage', 'active')
on conflict do nothing;

insert into drivers (display_name, phone, email, status) values
('Unassigned driver pool', '', '', 'active')
on conflict do nothing;

insert into price_rules (key, route_keys, service_keys, base_price, currency, duration_minutes, included_waiting_minutes) values
('airport-prague', array['airport'], array['airport-pickup','airport-dropoff'], 55, 'EUR', 45, 45),
('chauffeur-prague', array['chauffeur'], array['chauffeur'], 70, 'EUR', 60, 0),
('prague-vienna', array['vienna'], array['europe-transfer','daily-tour'], 390, 'EUR', 240, 30),
('prague-dresden', array['dresden'], array['europe-transfer','daily-tour'], 230, 'EUR', 120, 30),
('prague-cesky', array['cesky'], array['europe-transfer','daily-tour','program'], 260, 'EUR', 180, 30)
on conflict (key) do update set
route_keys = excluded.route_keys,
service_keys = excluded.service_keys,
base_price = excluded.base_price,
duration_minutes = excluded.duration_minutes,
included_waiting_minutes = excluded.included_waiting_minutes,
updated_at = now();

insert into price_rule_vehicle_rates (price_rule_id, vehicle_type, multiplier, minimum_price)
select price_rules.id, vehicle_type, multiplier, minimum_price
from price_rules
cross join (values
  ('sedan', 1.0, 0),
  ('v-class', 1.35, 0),
  ('minibus', 2.25, 0),
  ('coach', 4.4, 0)
) as rates(vehicle_type, multiplier, minimum_price)
on conflict (price_rule_id, vehicle_type) do update set
multiplier = excluded.multiplier,
minimum_price = excluded.minimum_price;

insert into price_surcharges (key, label, surcharge_type, value, conditions) values
('night', 'Night surcharge', 'percent', 15, '{"from":"22:00","to":"06:00"}')
on conflict (key) do update set label = excluded.label, surcharge_type = excluded.surcharge_type, value = excluded.value, conditions = excluded.conditions;

insert into cms_collections (key, language, status, data) values
('copy', 'en', 'published', '{"homeTitle":"Private Prague airport and Europe transfers","homeLead":"Premium sedans, Mercedes V-Class vans, minibuses and coaches for airport pickups, private chauffeur service, city-to-city routes and VIP programs."}'),
('copy', 'cs', 'published', '{"homeTitle":"Soukrome transfery z letiste Praha a po Evrope","homeLead":"Premiove sedany, Mercedes V-Class, minibusy a autobusy pro letistni transfery, soukromeho ridice, mezimestske trasy a VIP programy."}'),
('copy', 'ar', 'published', '{"homeTitle":"تنقلات خاصة من مطار براغ وإلى مدن أوروبا","homeLead":"سيارات سيدان فاخرة، مرسيدس V-Class، ميني باص وحافلات للرحلات من المطار، السائق الخاص، التنقل بين المدن والبرامج السياحية."}'),
('fleet', 'en', 'published', '[{"key":"sedan","title":"Luxury Sedan","capacity":"1-3","luggage":"2-3 bags"},{"key":"v-class","title":"Mercedes V-Class","capacity":"4-7","luggage":"5-7 bags"},{"key":"minibus","title":"Luxury Minibus","capacity":"8-20","luggage":"10-20 bags"},{"key":"coach","title":"Executive Coach","capacity":"21-60+","luggage":"Large luggage"}]'),
('services', 'en', 'published', '[{"key":"airport-pickup","title":"Airport pickup"},{"key":"chauffeur","title":"Private chauffeur"},{"key":"europe-transfer","title":"Europe transfers"},{"key":"daily-tour","title":"Daily tours"}]'),
('routes', 'en', 'published', '[{"key":"airport","slug":"airport-transfer-prague.html","title":"Prague Airport Transfer"},{"key":"chauffeur","slug":"private-chauffeur-prague.html","title":"Private Chauffeur in Prague"},{"key":"europe","slug":"europe-transfers.html","title":"Private Europe Transfers from Prague"},{"key":"vienna","slug":"prague-to-vienna-transfer.html","title":"Prague to Vienna Private Transfer"},{"key":"dresden","slug":"prague-to-dresden-transfer.html","title":"Prague to Dresden Private Transfer"},{"key":"cesky","slug":"prague-to-cesky-krumlov-transfer.html","title":"Prague to Cesky Krumlov Private Transfer"}]'),
('programs', 'en', 'published', '[{"key":"cesky","title":"Cesky Krumlov"},{"key":"karlovy","title":"Karlovy Vary"},{"key":"dresden","title":"Dresden"},{"key":"spindl","title":"Spindleruv Mlyn"},{"key":"dolni","title":"Dolni Morava"},{"key":"adventure","title":"Adventure Prague"}]'),
('faqs', 'en', 'published', '[["Do I pay before booking?","No. Send the trip details first. We confirm the vehicle, availability and fixed price before the booking is agreed."]]')
on conflict (key, language) do update set status = excluded.status, data = excluded.data, updated_at = now();
