import { cn } from "@/lib/utils";

interface HeadlineProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export default function Headline({
    title = "Beautiful Invoices, Made Simple",
    subtitle = "Ready in Seconds",
    className = "",
}: HeadlineProps) {
    return (
        <div className={cn("", className)}>
            <div className="flex items-center gap-4 mb-2">
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                {subtitle && (
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        {subtitle}
                    </span>
                )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                {title}
            </h1>
        </div>
    );
}