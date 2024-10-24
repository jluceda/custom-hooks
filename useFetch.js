import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const localCache = {};

export const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    hasError: false,
    error: null,
  });

  useEffect(() => {
    getFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const setLoadingState = () => {
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null,
    });
  };

  const getFetch = async () => {
    if (localCache[url]) {
      setState({
        data: localCache[url],
        isLoading: false,
        hasError: false,
        error: null,
      });

      return;
    }

    setLoadingState();

    const response = await fetch(url);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!response.ok) {
      setState({
        data: null,
        isLoading: false,
        hasError: true,
        error: response.statusText,
      });
      return;
    }

    const data = await response.json();
    setState({
      data: data,
      isLoading: false,
      hasError: false,
      error: null,
    });

    localCache[url] = data;
  };

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
  };
};

useFetch.propTypes = {
  url: PropTypes.string.isRequired,
};
