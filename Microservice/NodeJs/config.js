const stage = process.env.stage;
console.log(stage);
const resourcesStage = process.env.resourcesStage;
const region = process.env.region;
const adminPhoneNumber = "+15022371304";
const accountId = "706512677771";
const stageConfigs = {
  dev: {
  },
  prod: {
  }
};

const config = stageConfigs[stage] || stageConfigs.dev;

export default {
  stage,
  resourcesStage,
  adminPhoneNumber,
  region,
  accountId,
  ...config
};
