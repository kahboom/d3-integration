export default function syndesisHelper({ originalJson }) {

  /**
   * TODO: Replace with Interface + TS
   * Expected values from the main component
   * { "nodes": [
   *   {
   *     "id": string,
   *     "name": string,
   *     "category": string,
   *     "status": string,
   *     "isGroup"?: boolean,
   *     "isExpand"?: boolean,
   *     "expandable"?: boolean,
   *     "collapsible"?: boolean
   *   }
   * ] }
   */

  // If you need to traverse an object for the array of data, do that in the other component,
  // passing only the array to this function.

  // Check for Steps
  // Check for Step type
  // id = id
  // name = connections.connector.name , but what if it doesn't have a connector? is that possible?
  // actionType = category
  // status = currentState, for the entire integration
  // isGroup would depend on the actionType/category, same for the rest
  // connection.uses?
  // action.name could be useful
  // pattern is pretty important to know the particular order? or no?
  // metadata.configured? is that what we use to tell if configuration required?

  return originalJson;
}
