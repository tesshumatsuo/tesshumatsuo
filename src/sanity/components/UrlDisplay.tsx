import React from 'react'
import { Card, Text, Flex, Box } from '@sanity/ui'
import { useFormValue } from 'sanity'

interface UrlDisplayProps {
  type: 'preview' | 'published'
}

export function UrlDisplay(props: UrlDisplayProps) {
  const { type } = props
  const slug = useFormValue(['slug', 'current']) as string
  // Default to 'ja' if no language field is found yet
  const language = (useFormValue(['language']) as string) || 'ja'

  if (!slug) {
    return (
      <Card padding={3} radius={2} tone="caution">
        <Text size={1}>Please enter a slug to see the URL.</Text>
      </Card>
    )
  }

  const baseUrl = type === 'preview' 
    ? 'http://localhost:3000' 
    : 'https://tesshumatsuo.com'
  
  const url = `${baseUrl}/${language}/blog/${slug}`

  return (
    <Card padding={3} radius={2} shadow={1} tone="transparent" border>
      <Flex align="center">
        <Box flex={1}>
          <Text size={1} weight="bold" style={{ marginBottom: '4px', display: 'block' }}>
            {type === 'preview' ? 'Preview URL' : 'Published URL'}
          </Text>
          <Text size={1}>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#2276fc', textDecoration: 'none', wordBreak: 'break-all' }}
            >
              {url}
            </a>
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}
