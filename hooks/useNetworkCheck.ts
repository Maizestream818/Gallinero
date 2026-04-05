import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

import { useEffect, useState } from "react";

interface NetworkCheckResult {

isChecking: boolean;

isConnected: boolean;

}

export const useNetworkCheck = (): NetworkCheckResult => {

const [isChecking, setIsChecking] = useState<boolean>(true);

const [isConnected, setIsConnected] = useState<boolean>(false);

useEffect(() => {

const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {

// El ?? false asegura que si viene null o undefined, asuma que no hay red

setIsConnected(state.isConnected ?? false);

setIsChecking(false);

});

// Limpieza del listener al desmontar

return () => {

unsubscribe();

};

}, []);

return { isChecking, isConnected };

};