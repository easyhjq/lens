import "./clusters-menu.scss"
import { remote } from "electron"
import React from "react";
import { observer } from "mobx-react";
import { _i18n } from "../../i18n";
import { t, Trans } from "@lingui/macro";
import type { Cluster } from "../../../main/cluster";
import { userStore } from "../../../common/user-store";
import { clusterStore } from "../../../common/cluster-store";
import { workspaceStore } from "../../../common/workspace-store";
import { ClusterIcon } from "../+cluster-settings/cluster-icon";
import { Icon } from "../icon";
import { cssNames, IClassName } from "../../utils";
import { Badge } from "../badge";

// fixme: allow to rearrange clusters with drag&drop
// fixme: make add-icon's tooltip visible on init

interface Props {
  className?: IClassName;
}

@observer
export class ClustersMenu extends React.Component<Props> {
  showCluster = (cluster: Cluster) => {
    clusterStore.activeClusterId = cluster.id;
    console.log('load lens for cluster:', cluster.id);
  }

  addCluster = () => {
    console.log('navigate: /add-cluster')
  }

  showContextMenu = (cluster: Cluster) => {
    const { Menu, MenuItem } = remote
    const menu = new Menu();

    menu.append(new MenuItem({
      label: _i18n._(t`Settings`),
      click: () => console.log(`navigate to cluster settings`, cluster)
    }));
    if (cluster.initialized) {
      menu.append(new MenuItem({
        label: _i18n._(t`Disconnect`),
        click: () => console.log(`disconnect cluster and navigate to workspaces`, cluster)
      }))
    }

    menu.popup({
      window: remote.getCurrentWindow()
    })
  }

  render() {
    const { className } = this.props;
    const { newContexts } = userStore;
    const { currentWorkspace } = workspaceStore;
    const clusters = clusterStore.getByWorkspaceId(currentWorkspace);
    return (
      <div className={cssNames("ClustersMenu flex gaps column", className)}>
        {clusters.map(cluster => {
          return (
            <ClusterIcon
              key={cluster.id}
              showErrors={true}
              cluster={cluster}
              isActive={cluster.id === clusterStore.activeClusterId}
              onClick={() => this.showCluster(cluster)}
              onContextMenu={() => this.showContextMenu(cluster)}
            />
          )
        })}
        <div className="add-cluster" onClick={this.addCluster}>
          <Icon
            big material="add" className="add"
            tooltip={(
              <div className="flex column gaps">
                <p><Trans>This is the quick launch menu.</Trans></p>
                <p>
                  <Trans>
                    Associate clusters and choose the ones you want to access via quick launch menu by clicking the + button.
                  </Trans>
                </p>
              </div>
            )}
          />
          {newContexts.length > 0 && (
            <Badge className="counter" label={newContexts.length}/>
          )}
        </div>
      </div>
    );
  }
}
