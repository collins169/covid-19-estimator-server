/* jshint esversion: 8 */

const convertMonthsToDays = (months) => months * 30;

const convertWeeksToDays = (weeks) => weeks * 7;

const doMutiplication = (value, param) => value * param;

const getNumberOfDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'months':
    case 'month':
      return convertMonthsToDays(timeToElapse);
    case 'weeks':
    case 'week':
      return convertWeeksToDays(timeToElapse);
    default:
      return timeToElapse;
  }
};

const getHospitalSpace = (hospitalBeds, casesByTime) => (hospitalBeds * 0.35) - casesByTime;

const getDollarsInFlight = (
  infections,
  dayInc,
  popInc,
  period
) => infections * dayInc * popInc * period;

const estimateImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;

  const impact = {};
  impact.currentlyInfected = doMutiplication(reportedCases, 10);
  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** infectionRate);

  impact.severeCasesByRequestedTime = Math.trunc(doMutiplication(
    impact.infectionsByRequestedTime,
    0.15
  ));

  impact.hospitalBedsByRequestedTime = Math.trunc(getHospitalSpace(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  ));

  impact.casesForICUByRequestedTime = Math.trunc(doMutiplication(
    impact.infectionsByRequestedTime,
    0.05
  ));
  impact.casesForVentilatorsByRequestedTime = Math.trunc(doMutiplication(
    impact.infectionsByRequestedTime,
    0.02
  ));
  impact.dollarsInFlight = parseFloat(getDollarsInFlight(
    impact.infectionsByRequestedTime,
    region.avgDailyIncomeInUSD,
    region.avgDailyIncomePopulation,
    getNumberOfDays(periodType, timeToElapse)
  ).toFixed(2));

  return impact;
};

const estimateSevereImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;
  const severeImpact = {};

  severeImpact.currentlyInfected = doMutiplication(reportedCases, 50);

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** infectionRate);

  severeImpact.severeCasesByRequestedTime = Math.trunc(doMutiplication(
    severeImpact.infectionsByRequestedTime,
    0.15
  ));

  severeImpact.hospitalBedsByRequestedTime = Math.trunc(getHospitalSpace(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  ));

  severeImpact.casesForICUByRequestedTime = Math.trunc(doMutiplication(
    severeImpact.infectionsByRequestedTime,
    0.05
  ));
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(doMutiplication(
    severeImpact.infectionsByRequestedTime,
    0.02
  ));
  severeImpact.dollarsInFlight = parseFloat(getDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    region.avgDailyIncomeInUSD,
    region.avgDailyIncomePopulation,
    getNumberOfDays(periodType, timeToElapse)
  ).toFixed(2));
  return severeImpact;
};

const covid19ImpactEstimator = (data) => {
  const impact = estimateImpact(data);
  const severeImpact = estimateSevereImpact(data);
  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;
