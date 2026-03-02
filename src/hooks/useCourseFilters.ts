// Hook for filtering courses by search, category, and price
import { useState, useMemo, useEffect, useCallback } from "react";
import { Course, CourseCategory } from "../types/course";
import { useCourses } from "./useCourses";
import { fetchCourseCategories } from "../lib/api/courseApi";

export type PriceFilter = "all" | "free" | "paid";

interface UseCourseFiltersReturn {
  courses: Course[];
  filteredCourses: Course[];
  categories: CourseCategory[];
  loading: boolean;
  error: Error | null;
  retry: () => void;
  // Filter state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  priceFilter: PriceFilter;
  setPriceFilter: (filter: PriceFilter) => void;
  // Stats
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export const useCourseFilters = (): UseCourseFiltersReturn => {
  const { courses, loading, error, retry } = useCourses();
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");

  // Fetch categories on mount
  useEffect(() => {
    fetchCourseCategories()
      .then(setCategories)
      .catch((err) => console.error("[useCourseFilters] Failed to load categories:", err));
  }, []);

  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "" || priceFilter !== "all";

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter("");
    setPriceFilter("all");
  }, []);

  const filteredCourses = useMemo(() => {
    let result = courses.filter((c) => c.status === "active");

    // Search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase().trim();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(lower) ||
          course.description.toLowerCase().includes(lower) ||
          course.shortDescription.toLowerCase().includes(lower) ||
          (course.category?.toLowerCase().includes(lower) ?? false) ||
          (course.skills?.some((s) => s.toLowerCase().includes(lower)) ?? false),
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(
        (course) => course.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    // Price filter
    if (priceFilter === "free") {
      result = result.filter((course) => course.pricing.isFree);
    } else if (priceFilter === "paid") {
      result = result.filter((course) => !course.pricing.isFree);
    }

    return result;
  }, [courses, searchTerm, categoryFilter, priceFilter]);

  return {
    courses,
    filteredCourses,
    categories,
    loading,
    error,
    retry,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    priceFilter,
    setPriceFilter,
    totalCount: courses.filter((c) => c.status === "active").length,
    filteredCount: filteredCourses.length,
    hasActiveFilters,
    clearFilters,
  };
};

export default useCourseFilters;
