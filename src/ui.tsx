import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSpace } from "./views/Space/hooks";

type SidebarVisibility = boolean;

interface UiContextType {
  sidebarVisibility: SidebarVisibility;
  listId: string | undefined;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  const { listId } = useSpace();
  const [sidebarVisibility, setSidebarVisibility] = useState<SidebarVisibility>(
    isMobile && !listId ? true : true,
  );

  useEffect(() => {
    if (isMobile) {
      setSidebarVisibility(!listId);
    }
  }, [listId, isMobile]);

  return (
    <UiContext.Provider value={{ sidebarVisibility, listId }}>
      {children}
    </UiContext.Provider>
  );
};

export const useUi = (): UiContextType => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error("useUi must be used within a UiProvider");
  }
  return context;
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const useSidebarVisibility = () => {
  const uiContext = useUi();
  return uiContext.sidebarVisibility;
};

export const useListId = () => {
  const uiContext = useUi();
  return uiContext.listId;
};
