import { DisposableObject } from "backend/disposable-container";
import { FsUpdateType } from "backend/fs/fs-mapping";
import { interfaces } from "inversify";
import { AssetCreateRequest } from "shared/api.requests";
import { FilesystemEntry } from "shared/api.types";

export interface AssetContributionCapabilities {
  import?: boolean;
  create?: boolean;
}

export interface AssetInterface extends DisposableObject {
  getId?(): string;

  setEntry?(entry: FilesystemEntry): Promise<void> | void;
  onFsUpdate?(updateType: FsUpdateType, entry: FilesystemEntry | null): Promise<void> | void;

  suspendWatchCommands?(): Promise<void> | void;
  resumeWatchCommands?(): Promise<void> | void;

  runBuildCommands?(): Promise<void> | void;
}
export interface AssetCreator {
  createAsset(request: AssetCreateRequest): Promise<boolean>;
}

export interface AssetImporter {
  importAsset(request: AssetCreateRequest): Promise<boolean>;
}


export const AssetContribution = Symbol('AssetContribution');
export interface AssetContribution extends Partial<AssetCreator>, Partial<AssetImporter> {
  readonly name: string;
  readonly capabilities: AssetContributionCapabilities;

  loadAsset(assetEntry: FilesystemEntry): AssetInterface | void;
  onFsEntry?(entry: FilesystemEntry): Promise<void> | void;
}

export const bindAssetContribution = <T>(container: interfaces.Container, service: interfaces.Newable<T>, managerName: string) => {
  container.bind(AssetContribution).to(service).inSingletonScope().whenTargetTagged('managerName', managerName);
};
