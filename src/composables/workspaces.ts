import {ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {createSharedComposable} from '@vueuse/core'
import {ResponseInterface, WorkspaceModel, WorkspaceService} from 'zemit-sdk'

export const useWorkspace = () => {
  const service = new WorkspaceService()
  const workspace = ref<WorkspaceModel>()
  const workspaces = ref<WorkspaceModel[]>()
  const loading = ref(false)

  const router = useRouter()
  const route = useRoute('WorkspaceForm')

  const setWorkspaceFromRoute = () => {
    if (route.params.wid) {
      // route uuid changed
      if (!workspace.value || workspace.value.uuid !== route.params.wid) {
        workspace.value = workspaces.value?.find(el => el.uuid === route.params.wid)
      }
    }
    // workspace uuid removed
    else if (!route.params.wid) {
      workspace.value = undefined
    }
  }

  const setRouteFromWorkspace = () => {
    // workspace selected
    if (workspace.value) {
      // workspace uuid changed
      if (workspace.value.uuid !== route.params.wid) {
        router.push({name: 'Table', params: {wid: workspace.value.uuid}}).then()
      }
    }
    // workspace removed
    else {
      router.push({name: 'Home'}).then()
    }
  }

  const fetch = async (data?: {}) => {
    loading.value = true
    return service.find(data).then((response: ResponseInterface<any>) => {
      if (response.data.view.data) {
        workspaces.value = response.data.view.data
        setWorkspaceFromRoute()
      }
    }).finally(() => loading.value = false)
  }
  fetch().then();

  watch(() => route.params.wid, setWorkspaceFromRoute)
  watch(workspace, setRouteFromWorkspace)

  return {service, workspaces, workspace, loading, fetch}
}

export const useSharedWorkspace = createSharedComposable(useWorkspace)
