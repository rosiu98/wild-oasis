import styled from "styled-components";
import {
  createContext,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { createPortal } from "react-dom";
import useOutsideClick from "../hooks/useOutsideClick";

interface ListProps {
  position: {
    x: number;
    y: number;
  };
}

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<ListProps>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusContextProps {
  openId: number;
  close: () => void;
  open: (id: number) => void;
  position: null | { x: number; y: number };
  setPosition: Dispatch<SetStateAction<null | { x: number; y: number }>>;
}

const MenusContext = createContext<MenusContextProps>({
  openId: 0,
  close: () => {},
  open: (id: number) => {},
  position: null,
  setPosition: () => {},
});

const Menus = ({ children }: { children: React.ReactNode }) => {
  const [openId, setOpenId] = useState<number>(0);
  const [position, setPosition] = useState<MenusContextProps["position"]>(null);

  const close = () => setOpenId(0);
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
};

const Toggle = ({ id }: { id: number }) => {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetButton = (e.target as Element)?.closest("button");

    if (targetButton) {
      const rect = targetButton.getBoundingClientRect();
      openId === 0 || openId !== id ? open(id) : close();
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
    }
  };

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
};

const List = ({ id, children }: { id: number; children: React.ReactNode }) => {
  const { openId, position, close } = useContext(MenusContext);

  const { ref } = useOutsideClick<HTMLUListElement>({
    close,
    listenCapturing: false,
  });

  if (openId !== id || !position || !ref) return null;

  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  );
};

const Button = ({
  children,
  icon,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  icon: React.ReactElement;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const { close } = useContext(MenusContext);

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <li>
      <StyledButton disabled={disabled} onClick={handleClick}>
        {icon}
        {children}
      </StyledButton>
    </li>
  );
};

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
