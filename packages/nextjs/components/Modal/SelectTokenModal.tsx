import Image from "next/image";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import { useAccount } from "@starknet-react/core";
import { useEffect, useRef, useState } from "react";

interface SelecTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: string) => void;
  activeToken: string;
}

export default function SelecTokenModal({
  isOpen,
  onClose,
  onSelectToken,
  activeToken,
}: SelecTokenModalProps) {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>(activeToken);
  const [animateModal, setAnimateModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const strkBalanceWallet = useScaffoldStrkBalance({
    address: address,
  });
  const ethBalanceWallet = useScaffoldEthBalance({
    address: address,
  });

  const tokens = [
    {
      logo: "logo-starknet.svg",
      name: "Strk",
      amount: strkBalanceWallet?.formatted,
    },
    { logo: "logo-eth.svg", name: "Eth", amount: ethBalanceWallet?.formatted },
    { logo: "usdc.svg", name: "USDC", amount: "Coming Soon" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setTimeout(onClose, 300);
        setAnimateModal(false);
      }
    }

    if (isOpen) {
      setAnimateModal(true);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      setAnimateModal(false);
      setTimeout(() => {
        document.removeEventListener("mousedown", handleClickOutside);
      }, 300);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setAnimateModal(false);
      setTimeout(() => {
        setAnimateModal(true);
      }, 10);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          animateModal ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className={`w-[700px] h-[800px] rounded-[15px] p-12 bg-[#171C20] flex flex-col transition-all duration-300 transform ${
            animateModal
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center text-white mb-8">
            <p className="font-arcade font-bold text-[32px]">SELECT TOKEN</p>
            <p className="text-[20px]">Please select the token to deposit</p>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {tokens.map(({ logo, name, amount }, idx) => (
              <div
                key={idx}
                onClick={
                  name !== "USDC" ? () => setSelectedToken(name) : undefined
                }
                className={`flex items-center justify-between p-5 rounded-[8px] cursor-pointer ${
                  name === "USDC" ? "cursor-not-allowed opacity-50" : ""
                } ${
                  selectedToken === name && name !== "USDC"
                    ? "bg-[#0D333A] border border-[#02D2E4]"
                    : "bg-[#21262B]"
                }`}
              >
                <div className="flex items-center gap-5">
                  <Image src={logo} alt={name} width={20} height={20} />
                  <p className="text-[20px] uppercase">{name}</p>
                </div>
                <p className="text-[20px]">
                  {name === "USDC" ? amount : parseFloat(amount).toFixed(8)}
                </p>
              </div>
            ))}
          </div>

          <button
            className="w-full px-10 py-3 mt-4 shadow-button focus:outline-none font-arcade text-shadow-deposit text-2xl"
            onClick={() => {
              onSelectToken(selectedToken);
              setAnimateModal(false);
              setTimeout(onClose, 300);
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </>
  );
}
