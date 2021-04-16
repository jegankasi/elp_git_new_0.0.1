const tl_profile = require("../services/tl_profile.services");
const tl_user_type = require("../services/tl_user_type.services");
const tl_user = require("../services/tl_user.services");

const checkAndInsertProfile = async (dbConnection, userId, user_type) => {
    let profile = null;
    try {
        let userData = await tl_user.get(dbConnection, userId);
        if (userData) {
            let userType = await tl_user_type.get(dbConnection, { user_type: user_type }, ["id"]);
            if (userType && userType.id) {
                let profileWP = await tl_profile.get(dbConnection, { user_type_id: userType.id, parent_id: 0, type: 'G' });
                if (!profileWP) {
                    throw `${user_type} record does not exist in user_type_id of profile table`;
                }
                profile = await tl_profile.get(dbConnection, { parent_id: profileWP.id, user_type_id: userData.id, type: 'U' });

                if (!profile) {
                    let body = {
                        parent_id: profileWP.id,
                        user_type_id: userData.id,
                        type: "U",
                        description: `${user_type} ${userData.user_number}`
                    }
                    profile = await tl_profile.insert(dbConnection, body);
                }
            } else {
                throw `user type ${user_type}  does not exist`;
            }
        } else {
            throw "user_id does not exist";
        }
    } catch (error) {
        throw error;
    }
    return profile;
}

module.exports = {
    checkAndInsertProfile
}