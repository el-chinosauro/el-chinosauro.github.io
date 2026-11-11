require 'bibtex'

# Keep BibTeX as the single source for papers, with display metadata in YAML.
module EditorialResearch
  class Generator < Jekyll::Generator
    safe true
    priority :normal

    def plain(value)
      value.to_s.gsub('\\%', '%').gsub('\\$', '$').gsub('\\&', '&').delete('{}')
    end

    def generate(site)
      entries = {}
      groups = {}
      metadata = site.data.fetch('research', {})
      %w[papers working].each do |file|
        source = File.read(site.in_source_dir('_bibliography', "#{file}.bib")).sub(/\A---\s*\n---\s*\n/, '')
        records = BibTeX.parse(source).entries.values.map do |entry|
          paper = entry.fields.to_h.transform_keys(&:to_s).transform_values { |v| plain(v) }
          paper['key'] = entry.key
          paper['authors'] = entry[:author].to_s.split(' and ').map do |name|
            name.include?(',') ? name.split(',', 2).reverse.map(&:strip).join(' ') : name
          end
          fields = %w[title author journal year volume number pages doi].filter_map do |key|
            "  #{key} = {#{entry[key]}}" if entry[key]
          end
          paper['bibtex'] = "@#{entry.type}{#{entry.key},\n#{fields.join(",\n")}\n}"
          paper.merge!(metadata.fetch(entry.key, {}))
          paper['link'] = paper['pdf'] || paper['html']
          entries[entry.key] = paper
          paper
        end
        groups[file == 'papers' ? 'publications' : 'working'] = records.sort_by { |p| -p['year'].to_i }.map { |p| p['key'] }
      end

      groups['wip'] = []
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      site.collections.fetch('projects').docs.sort_by { |doc| doc.data.fetch('importance', 999) }.each do |doc|
        key = doc.data['editorial_key']
        next unless key

        paper = metadata.fetch(key, {}).merge(
          'key' => key, 'title' => doc.data['title'], 'author_note' => doc.data['description'],
          'project' => true, 'draft_request' => doc.data['draft_request']
        )
        if doc.data['abstract_from_content']
          paper['abstract'] = doc.content.strip
        elsif !doc.data['draft_request']
          paper['body_html'] = converter.convert(doc.content)
        end
        entries[key] = paper
        groups.fetch(doc.data.fetch('research_group', 'wip')) << key
      end
      site.data['research_entries'] = entries
      site.data['research_groups'] = groups
    end
  end
end
