import { useState } from 'react'
import { useDocumentOperation } from 'sanity'

interface TranslateActionProps {
  id: string
  type: string
  draft: any
  published: any
}

export function TranslateAction({ id, type, draft, published }: TranslateActionProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Only show this action on Japanese post documents
  const doc = draft || published
  if (type !== 'post') return null
  if (doc?.__i18n_lang && doc.__i18n_lang !== 'ja') return null

  const handleTranslate = async () => {
    setIsTranslating(true)
    setResult(null)

    try {
      const response = await fetch('/api/translate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setResult({
          success: false,
          message: data.error || '翻訳中にエラーが発生しました。',
        })
      } else {
        setResult({
          success: true,
          message: `✅ ${data.translatedLanguages}カ国語への翻訳が完了しました！\n各言語の記事が自動で保存されました。`,
        })
      }
    } catch (err: any) {
      setResult({ success: false, message: `ネットワークエラー: ${err.message}` })
    } finally {
      setIsTranslating(false)
    }
  }

  return {
    label: isTranslating ? '🔄 翻訳中...' : '🌍 全言語に一括翻訳',
    title: '日本語の記事を49カ国語に自動翻訳して一括公開します',
    disabled: isTranslating,
    dialog: dialogOpen
      ? {
          type: 'dialog' as const,
          header: '50カ国語 一括翻訳システム',
          content: result ? (
            <div style={{ padding: '20px', lineHeight: 1.6 }}>
              <p style={{ 
                color: result.success ? '#22c55e' : '#ef4444',
                fontWeight: 'bold',
                whiteSpace: 'pre-line'
              }}>
                {result.message}
              </p>
              <button
                onClick={() => {
                  setDialogOpen(false)
                  setResult(null)
                }}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                閉じる
              </button>
            </div>
          ) : (
            <div style={{ padding: '20px', lineHeight: 1.6 }}>
              <p>この記事を<strong>49カ国語</strong>に自動翻訳します。</p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                ⚠️ 既存の翻訳があれば上書きされます。<br />
                翻訳には30秒〜1分ほどかかります。
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  style={{
                    padding: '8px 16px',
                    background: isTranslating ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isTranslating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isTranslating ? '🔄 翻訳中...' : '🚀 翻訳を開始する'}
                </button>
                <button
                  onClick={() => setDialogOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          ),
          onClose: () => {
            setDialogOpen(false)
            setResult(null)
          },
        }
      : undefined,
    onHandle: () => {
      setDialogOpen(true)
    },
  }
}
