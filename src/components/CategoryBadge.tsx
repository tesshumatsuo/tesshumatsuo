interface CategoryBadgeProps {
  name: string
}

export default function CategoryBadge({ name }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      {name}
    </span>
  )
}
