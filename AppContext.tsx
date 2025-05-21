import React, {createContext, useContext, useState} from 'react';

type Pet = {
  id: number;
  title: string;
  name: string;
  breed: string;
  weight: string;
  age: string;
  sex: string;
};

type PetContextType = {
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
};

type DeviceIdContextType = {
  deviceId: string;
  setDeviceId: React.Dispatch<React.SetStateAction<string>>;
};

const DeviceIdContext = createContext<DeviceIdContextType | undefined>(
  undefined,
);

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC = ({children}) => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      title: 'CAGE 1',
      name: 'Sulgoo',
      breed: 'Maltaes',
      weight: '2.2',
      age: '5',
      sex: 'Male',
    },
    // {
    //   id: 2,
    //   title: 'CAGE 2',
    //   name: 'DryBread',
    //   breed: 'Chow chow',
    //   weight: '3.5',
    //   age: '1',
    //   sex: 'Female',
    // },
    // {
    //   id: 3,
    //   title: 'CAGE 3',
    //   name: 'DryBread',
    //   breed: 'Chow chow',
    //   weight: '3.5',
    //   age: '1',
    //   sex: 'Female',
    // },
  ]);

  const [deviceId, setDeviceId] = useState<string>('');

  return (
    <PetContext.Provider value={{pets, setPets}}>
      <DeviceIdContext.Provider value={{deviceId, setDeviceId}}>
        {children}
      </DeviceIdContext.Provider>
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePetContext는 PetProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

export const useDeviceIdContext = () => {
  const context = useContext(DeviceIdContext);
  if (!context) {
    throw new Error(
      'useDeviceIdContext는 PetProvider 내에서 사용되어야 합니다.',
    );
  }
  return context;
};
