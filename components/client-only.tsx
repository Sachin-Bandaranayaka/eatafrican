"use client"

import { useEffect, useState, ReactNode } from "react"

interface ClientOnlyProps {
    children: ReactNode
    fallback?: ReactNode
}

/**
 * ClientOnly component to prevent hydration mismatch errors.
 * Only renders its children on the client-side after hydration is complete.
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return <>{fallback}</>
    }

    return <>{children}</>
} 