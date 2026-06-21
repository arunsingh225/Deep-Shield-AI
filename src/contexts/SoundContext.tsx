import React from 'react';

export const SoundContext = React.createContext<{
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: 'SAFE' | 'FAKE') => void;
}>({
  isSoundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

export const useSound = () => React.useContext(SoundContext);
