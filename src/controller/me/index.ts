import { findByIds } from "./../../infra/userProfile";
import { findById as findTeamProfileById } from "./../../infra/teamProfile";
import { RequestHandler } from "../route";

type userResponse = {
  name: string;
  icon: string;
};

type teamResponse = {
  name: string;
  icon: {
    [key: string]: unknown;
  } | null;
};

type MeResponse = {
  user: userResponse;
  team: teamResponse;
};

export const me: RequestHandler<MeResponse> = async (req, res) => {
  console.log("get /me");
  const user = req["user"];
  if (!user) {
    res.status(400).send("user not found");
  }

  if (user) {
    const [userProfile, teamProfile] = await Promise.all([
      findByIds({
        userId: user.userId,
        teamId: user.teamId,
      }),
      findTeamProfileById(user.teamId),
    ]);
    const response = {
      user: {
        name: userProfile?.name || "",
        icon: userProfile?.icon || "",
      },
      team: {
        name: teamProfile?.name || "",
        icon: teamProfile?.icon ? JSON.parse(teamProfile.icon) : null,
      },
    };

    if (userProfile) {
      res.status(200).send(response);
    } else {
      res.status(400).send("userprofile not found");
    }
  }
};
