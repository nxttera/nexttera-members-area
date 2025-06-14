import { defineStore } from "pinia"
// No need to import anything, nuxt will handle the importsß

export const useUserStore = defineStore('user', () => {
  const {
    data: profile,
    pending: loadingProfile,
    error: errorProfile,
    refresh: refreshProfile
  } = useFetch<User>('/api/me')

  const {
    data: dailyQuests,
    pending: loadingDailyQuests,
    error: errorDailyQuests,
    refresh: refreshDailyQuests
  } = useFetch<Quest[]>('/api/users/me/quests/daily', { immediate: false })

  const {
    data: courseProgress,
    pending: loadingProgress,
    error: errorProgress,
    refresh: refreshProgress
  } = useFetch<CourseProgress[]>('/api/users/me/courses/progress', { immediate: false })

  const fetchProfile = () => {
    refreshProfile()
  }
  
  const fetchDailyQuests = () => {
    refreshDailyQuests()
  }

  const fetchCourseProgress = () => {
    refreshProgress()
  }

  return {
    profile,
    loadingProfile,
    errorProfile,
    fetchProfile,
    dailyQuests,
    loadingDailyQuests,
    errorDailyQuests,
    fetchDailyQuests,
    courseProgress,
    loadingProgress,
    errorProgress,
    fetchCourseProgress
  }
})
