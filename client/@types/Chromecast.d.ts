declare const cast: {
  framework: {
    CastContext: {
      getInstance: () => {
        getCurrentSession: () => any,
        setOptions: (options: { receiverApplicationId: string }) => void,
      },
    },
  },
};

declare const chrome: {
  cast: {
    media: {
      DEFAULT_MEDIA_RECEIVER_APP_ID: string,
    },
  },
};