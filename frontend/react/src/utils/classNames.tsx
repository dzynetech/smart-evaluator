//combine css classNames for easier use with ternary operators 
//ie classNames( disabled ? 'text-gray-400' : active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'always-applied')
export function classNames(...classes : string[]): string {
    return classes.filter(Boolean).join(' ')
}