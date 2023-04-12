import { useEffect } from 'react';

const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  });

  return title;

};

export default useTitle;

