const tl_profile = require("../services/tl_profile.services");
const tl_user_roles = require("../services/tl_user_roles.services");
const tl_user = require("../services/tl_user.services");
const { currentDate, action_flag_A, action_flag_M } = require('../utils/utils');

const checkAndInsertProfile = async (dbConnection, userId, user_role, user_session_id) => {

    let profile = null;
    try {
        let userData = await tl_user.get(dbConnection, { user_id: userId });
        if (userData) {
            let userRole = await tl_user_roles.get(dbConnection, { user_role: user_role }, ["user_role_id"]);

            if (userRole && userRole.user_role_id) {
                profile = await tl_profile.get(dbConnection, { user_role_id: userRole.user_role_id, parent_id: 0, type: 'G' });
                if (!profile) {
                    throw `${user_role} record does not exist in user_role_id of profile table`;
                }
                let isProfile = await tl_profile.get(dbConnection, { parent_id: profile.profile_id, user_role_id: userData.user_id, type: 'U' });

                if (!isProfile) {
                    let body = {
                        parent_id: profile.profile_id,
                        user_role_id: userData.user_id,
                        type: "U",
                        modified_by: user_session_id,
                        created_by: user_session_id
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