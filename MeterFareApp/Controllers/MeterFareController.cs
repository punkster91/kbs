﻿using MeterFare.Data.Services;
using System;
using System.Web.Http;

namespace MeterFare.UI.Controllers
{
    /// <summary>
    /// Meter Fare controller
    /// </summary>
    public class MeterFareController : ApiController
    {
        /// POST: MeterFare/CalculateFare
        /// <summary>
        /// Calculates the meter fare based on the meter time and distance traveled
        /// </summary>
        /// <param name="meterTime"></param>
        /// <param name="milesTraveled"></param>
        /// <param name="minutesTraveled"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult CalculateFare(string meterTime, float milesTraveled, uint minutesTraveled)
        {
            try
            {
                MeterFareService meterFareService = new MeterFareService(new SurchargesProvider());

                DateTime meterDate;
                if (!DateTime.TryParse(meterTime, out meterDate))
                {
                    throw new Exception(string.Format("Unable to format meter time: {0}", meterTime));
                }

                decimal totalFare = meterFareService.CalculateTotalFare(meterDate,
                    MeterFareService.BASEFARE,
                    MeterFareService.UNITFARE,
                    milesTraveled,
                    minutesTraveled);

                return Ok(totalFare);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}