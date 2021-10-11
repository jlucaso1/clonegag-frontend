import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ref } from 'vue';

function useFetch<Type>(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig
) {
  const loading = ref(true);
  const error = ref();
  const data = ref<Type>();
  const fetch = () => {
    axiosInstance(config)
      .then((res) => (data.value = res.data as Type))
      .catch((err) => (error.value = err as unknown))
      .finally(() => (loading.value = false));
  };
  return { fetch, data, error, loading };
}

export { useFetch };
