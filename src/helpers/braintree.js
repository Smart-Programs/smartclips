import { BraintreeGateway, Environment } from 'braintree'

import config from '../config'

const gateway = new BraintreeGateway({
  environment: Environment[config.BRAINTREE_ENV],
  merchantId: process.env.BRAINTREE_MERCHANT,
  privateKey: process.env.BRAINTREE_PRIVATE,
  publicKey: process.env.BRAINTREE_PUBLIC
})

gateway.timeout = 5000

export const getToken = async customerId =>
  customerId
    ? gateway.clientToken.generate({ customerId })
    : gateway.clientToken.generate()

export const getSubscription = async customerId => {
  const free = {
    subscription: null,
    plan: { name: 'Free' },
    meta: getPlanMeta()
  }

  if (typeof customerId !== 'string' || customerId === '')
    return Promise.resolve(free)

  const [braintree_error, customer] = await to(
    gateway.customer.find(customerId)
  )

  if (braintree_error) return Promise.reject(braintree_error)
  else if (!customer) return Promise.resolve(free)

  const subscription = customer.paymentMethods.find(({ subscriptions }) =>
    subscriptions.find(sub => sub.status === 'Active')
  )

  if (!subscription) return Promise.resolve(free)

  const planId = subscription.planId

  const [braintree_error_plan, plans] = await to(gateway.plan.all())

  if (braintree_error_plan) return Promise.reject(braintree_error_plan)

  const plan = plans.find(({ id }) => id === planId)

  if (!plan) return Promise.resolve(free)

  return Promise.resolve({
    subscription,
    plan,
    meta: getPlanMeta(plan.name)
  })
}

export const getPlanMeta = name => {
  if (name && typeof name === 'string') name = name.toLowerCase()

  switch (name) {
    case 'professional':
      return {
        clipLength: 90,
        storageTimeDays: 60,
        totalStorage: 1000,
        creationsPerDay: 100,
        inExplore: true
      }
    case 'upcoming':
      return {
        clipLength: 60,
        storageTimeDays: 30,
        totalStorage: 500,
        creationsPerDay: 50,
        inExplore: true
      }
    default:
      return {
        clipLength: 30,
        storageTimeDays: 7,
        totalStorage: 50,
        creationsPerDay: 10
      }
  }
}
