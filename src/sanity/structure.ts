import type {StructureResolver} from 'sanity/structure'
import { Iframe } from 'sanity-plugin-iframe-pane'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('post')
        .title('Posts')
        .child(
          S.documentTypeList('post')
            .title('Posts')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('post')
                .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc: any) =>
                        doc?.slug?.current
                          ? `/ja/blog/${doc.slug.current}`
                          : `/ja/blog`,
                      reload: { button: true },
                    })
                    .title('Preview'),
                ])
            )
        ),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author'].includes(item.getId()!),
      ),
    ])
