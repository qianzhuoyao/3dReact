self.onmessage = function(event) {
    const { sceneData, meshId } = event.data;
  
    function findMeshGroups(scene, meshId) {
      const groups = [];
  
      function traverse(obj) {
        if (obj.type === "Group") {
          if (obj.children.some(child => child.id === meshId)) {
            groups.push(obj);
          }
        }
        obj.children.forEach(traverse);
      }
  
      traverse(scene);
      return groups;
    }
  
    // 查找 meshId 所属的所有 Group
    const groups = findMeshGroups(sceneData, meshId);
    
    // 发送回主线程
    self.postMessage(groups);
  };