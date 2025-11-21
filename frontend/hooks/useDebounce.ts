import { useState, useEffect, useRef } from "react";

export const useDebounce = (threshold: number) => {
    const [hasTimeoutReached, setHasTimeoutReached] = useState(false);
    const lastKeyPressRef = useRef<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateLastKeyPress = () => {
        lastKeyPressRef.current = Date.now();
        setHasTimeoutReached(false);
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            const now = Date.now();
            if (lastKeyPressRef.current !== null && now - lastKeyPressRef.current >= threshold) {
                setHasTimeoutReached(true);
            }
        }, threshold);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { hasTimeoutReached, updateLastKeyPress };
}