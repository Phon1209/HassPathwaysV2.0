import { useEffect, useState, useDeferredValue } from "react";
import { IPathwaySchema } from "@/public/data/dataInterface";
import { validCatalogYear } from "@/public/data/staticData";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";

const useFetchPathways = (catalog_year: string) => {
    const { setPathways } = useAppContext();

    useEffect(() => {
        const apiController = new AbortController();
        const validYear = validCatalogYear.includes(catalog_year);
        const searchYear = validYear ? "2022-2023" : catalog_year
        console.log(searchYear);

        fetch(
            `http://localhost:3000/api/pathway/search?${new URLSearchParams({
                searchString: "",
                department: "",
                catalogYear: searchYear,
            })}`,
            {
                signal: apiController.signal,
                cache: "no-store",
                next: {
                    revalidate: false,
                },
            }
        )
            .then((data) => data.json())
            .then((data) => {
                setPathways(data);
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                console.error("Fetching Error: ", err);
            });

        return () => apiController.abort();
    }, [catalog_year]); // Trigger whenever catalog_year changes
};

export default useFetchPathways;