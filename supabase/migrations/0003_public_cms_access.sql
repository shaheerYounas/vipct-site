create policy "public published cms blocks" on cms_blocks
  for select using (
    exists (
      select 1
      from cms_pages
      where cms_pages.id = cms_blocks.page_id
        and cms_pages.status = 'published'
    )
  );

create policy "public company site settings" on site_settings
  for select using (key in ('company'));

grant select on cms_pages to anon, authenticated;
grant select on cms_blocks to anon, authenticated;
grant select on cms_collections to anon, authenticated;
grant select on site_settings to anon, authenticated;
