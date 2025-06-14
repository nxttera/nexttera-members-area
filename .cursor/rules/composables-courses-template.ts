// No need to import anything, nuxt will handle the imports
export const useCourses = () => {
  const {
    data: courses,        
    pending: loadingCourses,
    error: errorCourses,
  } = useFetch<Course[]>('/api/courses')
  
  const selectedCourseId = ref<string | null>(null)
  const selectedLessonId = ref<string | null>(null)

  const {
    data: lessons,         
    pending: loadingLessons,
    error: errorLessons,
    refresh: fetchLessons  
  } = useFetch<Lesson[]>(
    () => {
      return selectedCourseId.value
        ? `/api/courses/${selectedCourseId.value}/lessons`
        : null
    },
    { immediate: false }
  )

  const {
    data: comments,          
    pending: loadingComments,
    error: errorComments,
    refresh: fetchComments   
  } = useFetch<Comment[]>(
    () => {
      return selectedLessonId.value
        ? `/api/lessons/${selectedLessonId.value}/comments`
        : null
    },
    { immediate: false }
  )

  watch(selectedCourseId, (newCourseId: string | null) => {
    if (newCourseId) {
      fetchLessons()   
    } else {
      lessons.value = []
    }
    selectedLessonId.value = null
  })

  watch(selectedLessonId, (newLessonId: string | null) => {
    if (newLessonId) {
      fetchComments()   
    } else {
      comments.value = []
    }
  })

  return {
    courses, loadingCourses, errorCourses,
    selectedCourseId,
    lessons, loadingLessons, errorLessons,
    fetchLessons,
    selectedLessonId,
    comments, loadingComments, errorComments,
    fetchComments,
  }
}
