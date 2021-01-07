const utils       = require("../../utils/utils");

exports.getRoot = async (req, reply) => {
    var data = "root success";
    utils.rr2r(reply, 200, true, "test", "root.txt", 0, [data], [], "ctrl_root:test" ); 
}
