import React, { useCallback, useState } from 'react'
import { Card, Text, TextInput, Stack, Box, Flex, Button, Spinner, Label, TextArea } from '@sanity/ui'
import { set, unset } from 'sanity'

export function LinkCardInput(props: any) {
  const { elementProps, onChange, value = {} } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUrlChange = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      const url = event.target.value
      if (!url) return

      // Don't fetch if title/description already present (unless specifically asked)
      // but the user wants "automatic"
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`)
        const data = await res.json()

        if (data.error) throw new Error(data.error)

        // Bulk update the object fields
        onChange([
          set(url, ['url']),
          set(data.title || '', ['title']),
          set(data.description || '', ['description']),
          set(data.image || '', ['image']),
        ])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [onChange]
  )

  const handleFieldChange = useCallback(
    (fieldName: string, fieldValue: string) => {
      onChange(fieldValue ? set(fieldValue, [fieldName]) : unset([fieldName]))
    },
    [onChange]
  )

  return (
    <Card padding={3} radius={2} border shadow={1}>
      <Stack space={4}>
        <Box>
          <Label size={1} weight="bold">URL</Label>
          <Box marginTop={2}>
            <TextInput
              {...elementProps}
              value={value.url || ''}
              onBlur={handleUrlChange}
              onChange={(e) => handleFieldChange('url', e.currentTarget.value)}
              placeholder="https://example.com"
            />
          </Box>
        </Box>

        {loading && (
          <Flex align="center" gap={2}>
            <Spinner size={1} />
            <Text size={1}>Metadata fetching...</Text>
          </Flex>
        )}

        {error && (
          <Text size={1} style={{ color: '#d73a49' }}>Error: {error}</Text>
        )}

        <Box>
          <Label size={1} weight="bold">Title</Label>
          <Box marginTop={2}>
            <TextInput
              value={value.title || ''}
              onChange={(e) => handleFieldChange('title', e.currentTarget.value)}
            />
          </Box>
        </Box>

        <Box>
          <Label size={1} weight="bold">Description</Label>
          <Box marginTop={2}>
            <TextArea
              rows={3}
              value={value.description || ''}
              onChange={(e) => handleFieldChange('description', e.currentTarget.value)}
            />
          </Box>
        </Box>

        <Box>
          <Label size={1} weight="bold">Image URL</Label>
          <Box marginTop={2}>
            <TextInput
              value={value.image || ''}
              onChange={(e) => handleFieldChange('image', e.currentTarget.value)}
            />
          </Box>
        </Box>
      </Stack>
    </Card>
  )
}
