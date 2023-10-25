import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import createProvider from "../helpers/createProvider";
dotenv.config();

const FILENAME = "accountInfo.json";
const __dirname = import.meta.url.split("/scripts")[0].split("file://")[1];

async function main() {
  const provider = await createProvider();

  const counterfactualAddress = await provider.getAddress();

  console.log(counterfactualAddress);

  const filePath = path.join(__dirname, FILENAME);
  let data = {};

  data["counterfactualAddress"] = counterfactualAddress;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return counterfactualAddress;
}

main().then((address) => {
  console.log("Your counterfactual address: ", address);
});
