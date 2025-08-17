export default function Tag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`px-2 py-0.5 bg-gray-100 border border-gray-200 text-sm ${className}`}>
            {children}
        </span>
    );
}