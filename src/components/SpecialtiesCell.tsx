interface SpecialtiesCellProps {
  specialties: unknown;
}

export default function SpecialtiesCell({ specialties }: SpecialtiesCellProps) {
  if (Array.isArray(specialties)) {
    return (
      <div className="flex flex-wrap gap-1">
        {specialties.map((specialty: string, index: number) => (
          <span 
            key={index} 
            className="inline-block px-2 py-1 text-xs leading-4 bg-gray-50 border border-gray-300 rounded-md break-words"
            style={{ wordBreak: 'break-word', hyphens: 'auto' }}
          >
            {specialty}
          </span>
        ))}
      </div>
    );
  }

  return <div className="text-sm">{String(specialties)}</div>;
} 