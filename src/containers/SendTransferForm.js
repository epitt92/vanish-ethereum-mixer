import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  Divider,
  FormContainerUI,
  FormTitle,
} from "../components/FormContainerUI";
import { TextField, TextFieldController } from "../components/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import {
  TOKEN,
  TOKEN_NAME,
  RECEPIENT_WALLET_ADDRESS_MAX_LENGTH,
  RECEPIENT_WALLET_ADDRESS_MIN_LENGTH,
} from "../constants";
import { Button } from "../components/Button";
import { DropdownFieldController } from "../components/DropdownField";
import { tokensOptions } from "../constants/tokens";
import { isWalletValid } from "../utils/isWalletValid";
import { FormatNumber } from "../components/FormatNumber";
import { useWalletAccount } from "../store";
import {
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
// import { useContract } from "../hooks/useContract";
import { parseEther, ethers } from "ethers";
import {
  MIXER_ABI,
  MIXER_ADDRESS,
  ERC20_ABI,
  TOKEN_ADDRESS,
  API_ENDPOINT,
} from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const SendTransferForm = () => {
  const account = useWalletAccount((state) => state.account);
  const available = account.balanceFormatted
    ? Number(Number(account.balanceFormatted).toFixed(3))
    : 0;
  const fee = 2;
  const minFee = 0.002;

  const [timestamp, setTimestamp] = useState();
  const schema = useMemo(() => {
    return yup.object({
      recepientWallet: yup
        .string()
        .min(
          RECEPIENT_WALLET_ADDRESS_MIN_LENGTH,
          "Recipient Wallet Address is too short"
        )
        .test("wallet-validate", "Wallet address is invalid", (wallet) =>
          isWalletValid(wallet)
        )
        .max(
          RECEPIENT_WALLET_ADDRESS_MAX_LENGTH,
          `Recipient Wallet Address is too long`
        )
        .required("Recipient Wallet Address  is missing"),
      amount: yup
        .number()
        .typeError("This field is required")
        .min(0.00001, "Amount should be bigger than 0.00001")
        .max(available, `Amount should not be bigger than ${available}`)
        .required("This field is required"),
    });
  }, []);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      recepientWallet: "",
      amount: 0,
      sourceToken: TOKEN.ETH,
      destinationToken: TOKEN.ETH,
    },
  });

  // const { depositConfig } = useContract();
  const { write, data, error, isLoading, isError, isSuccess } =
    useContractWrite({
      address: MIXER_ADDRESS,
      abi: MIXER_ABI,
      functionName: "deposit",
    });
  // const { config } = usePrepareContractWrite({
  //   address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
  //   abi: [
  //     {
  //       name: "mint",
  //       type: "function",
  //       stateMutability: "nonpayable",
  //       inputs: [],
  //       outputs: [],
  //     },
  //   ],
  //   functionName: "mint",
  // });
  // const [config, setConfig] = useState(config);

  const pButtons = [25, 50, 75, 100];

  const handleAmountButtonClick = (percentage) => () => {
    let amount = ((available || 0) * percentage) / 100;
    amount = parseFloat(amount.toFixed(12)); // TODO: not sure how many decimals should there be
    setValue("amount", amount, { shouldValidate: true });
  };
  const sourceToken = watch("sourceToken");
  const destinationToken = watch("destinationToken");
  const calcFee = () => {
    return Number(
      Math.max((Number(watch("amount")) * fee) / 100, minFee).toFixed(4)
    );
  };

  const transfer = async () => {
    const tmp = new Date().getTime();
    setTimestamp(tmp);
    write({ args: [tmp], value: parseEther(watch("amount").toString()) });
  };

  useEffect(() => {
    if (data?.hash && isSuccess) {
      toast.success("Successfully Transfered.");
      axios.post(`${API_ENDPOINT}/withdraw`, {
        sender: account.address,
        receiver: watch("recepientWallet"),
        amount: watch("amount"),
        timestamp,
        type: "ETH",
      });
    }
  }, [isSuccess, data]);
  return (
    <FormContainerUI title="You Send">
      <form autoComplete="off" className="flex flex-col gap-[20px]">
        <DropdownFieldController
          label="Select source currency"
          name="sourceToken"
          append={
            <span className="text-white/60">
              {TOKEN_NAME[sourceToken]} ({sourceToken})
            </span>
          }
          control={control}
          options={tokensOptions}
          dropdownTitle="Select a Token"
        />

        <TextFieldController
          label="Enter Amount"
          helpText={
            <>
              <span className="text-white/50">Available:</span>{" "}
              {available ? <FormatNumber value={available} /> : "00"}
            </>
          }
          placeholder="Enter Amount"
          name="amount"
          control={control}
          type="number"
          inputProps={{
            className: "pr-[80px]",
            isAllowed: (values) => {
              const { floatValue } = values;
              console.log("floatValue", floatValue);
              return !floatValue || floatValue <= available;
            },
          }}
          append={
            <button
              type="button"
              onClick={handleAmountButtonClick(100)}
              className="text-red font-medium text-sm tracking-button"
            >
              MAX
            </button>
          }
        />

        <div className="flex justify-between gap-3">
          {pButtons.map((b, idx) => (
            <Button
              key={idx}
              color="secondary-outlined"
              size="medium"
              className="w-full"
              onClick={handleAmountButtonClick(b)}
            >
              {b}%
            </Button>
          ))}
        </div>

        <Divider />

        <FormTitle>You Get</FormTitle>

        <DropdownFieldController
          label="Destination currency"
          name="destinationToken"
          append={
            <span className="text-white/60">
              {TOKEN_NAME[destinationToken]} ({destinationToken})
            </span>
          }
          control={control}
          options={tokensOptions}
          dropdownTitle="Select a Token"
        />

        <TextFieldController
          label="Recipient Wallet Address"
          placeholder="Enter wallet address"
          name="recepientWallet"
          control={control}
        />

        <TextField
          label="FEE"
          placeholder="Total"
          name="recepientWallet"
          helpText={`${account.address ? calcFee() : 0} ${
            account.balanceSymbol || "ETH"
          }`}
          infoTooltip={
            <>
              <div>
                <span className="text-red font-bold">2%</span> - standard fee{" "}
                <span className="text-red">(current)</span>
              </div>
              <div>
                <span className="text-red font-bold">0%</span> - available for
                NFT holders
              </div>
            </>
          }
          readOnly
          inputProps={{
            className: "placeholder-white/60",
          }}
          append={
            <span className="text-white text-base">
              {account.address
                ? Number((Number(watch("amount")) - calcFee()).toFixed(4))
                : 0}{" "}
              {account.balanceSymbol || "ETH"}
            </span>
          }
        />
        {account.address ? (
          <Button
            color="primary"
            onClick={() => transfer()}
            disabled={isLoading}
          >
            Transfer Now {isLoading && "..."}
          </Button>
        ) : (
          <Button color="primary" disabled={true}>
            Connect Wallet
          </Button>
        )}
      </form>
    </FormContainerUI>
  );
};
