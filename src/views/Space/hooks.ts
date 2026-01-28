import { useMatch, useNavigate, useParams } from "react-router";
import {
  useAllListsQuery,
  useListDelete,
  useListMutation,
} from "../../services/lists";
import { useSpaceQuery } from "../../services/spaces";

export const useSpace = () => {
  const {
    data: spaceData,
    error: spaceError,
    isLoading: spaceLoading,
    isPending: spacePending,
  } = useSpaceQuery();
  const navigate = useNavigate();
  const _routerPathParams = useParams();
  const _urlPathParams: { params?: { spaceId?: string; listId?: string } } =
    useMatch("/:spaceId/list/:listId") ?? {};

  const spaceId =
    _routerPathParams?.spaceId ??
    _urlPathParams.params?.spaceId ??
    spaceData?.id;
  const listId = _routerPathParams?.listId ?? _urlPathParams.params?.listId;

  const {
    data: listsData,
    error: listsError,
    isLoading: listsLoading,
    isPending: listsPending,
  } = useAllListsQuery(spaceId);

  const { mutateAsync: deleteList } = useListDelete(spaceId);

  const isLoading =
    spaceLoading || spacePending || listsPending || listsLoading;
  const error = listsError || spaceError;

  const { mutateAsync: createList } = useListMutation(spaceData?.id);

  return {
    space: spaceData,
    lists: listsData,
    isLoading,
    error,
    navigate,
    spaceId,
    listId,
    deleteList,
    createList,
  };
};
