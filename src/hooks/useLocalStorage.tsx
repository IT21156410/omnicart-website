import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

export const useLocalStorage = <T, >(keyName: string, defaultValue: T): [T, (newValue: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => fetchStorageValue());
    const location = useLocation()

    useEffect(() => {
        setValue(fetchStorageValue());
    }, [location.pathname]);

    function fetchStorageValue() {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value) as T;
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            console.error(err);
            return defaultValue;
        }
    }

    const setValue = (newValue: T): void => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
        setStoredValue(newValue);
    };

    return [storedValue, setValue];
};
