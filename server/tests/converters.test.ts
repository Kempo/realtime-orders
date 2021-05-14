import { fulfillOrder } from '../src/converters';

const mockSessionId = 'some-session-id';

describe('order fulfillment', () => {
  it('should successfully fulfill a single item order', async () => {

    const mockStripeLineItems = [
      {
        description: 'Falafel',
        unitPrice: 400,
        quantity: 3
      }
    ]

    const mockPrismaResponse = [
      {
        id: 1,
        title: 'Falafel'
      }
    ]

    const mockContext = {
      prisma: {
        item: {
          findMany: jest.fn().mockResolvedValue(mockPrismaResponse)
        }
      },
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue({
              data: mockStripeLineItems
            })
          }
        }
      }
    };

    const fulfilledOrder = await fulfillOrder(mockSessionId, mockContext as any);

    expect(fulfilledOrder.length).toBe(1);
    expect(fulfilledOrder[0].quantity).toBe(3);
    expect(fulfilledOrder[0].itemId).toBe(1);
  });

  it('should return an empty response if Stripe cannot find line items', async () => {
    const mockContext = {
      prisma: {
        item: {
          findMany: jest.fn().mockResolvedValue([])
        }
      },
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue(null)
          }
        }
      }
    };

    const fulfilledOrder = await fulfillOrder(mockSessionId, mockContext as any);

    expect(mockContext.prisma.item.findMany).toHaveBeenCalledTimes(0);
    expect(fulfilledOrder.length).toBe(0);
  });

  it('should throw error if there is a missing quantity field from Stripe', async () => {
    const mockContext = {
      prisma: {
        item: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: 1,
              title: 'Falafel'
            }
          ])
        }
      },
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue({
              data: [
                {
                  description: 'Falafel',
                  unitPrice: 400
                }
              ]
            })
          }
        }
      }
    };

    try{
      await fulfillOrder(mockSessionId, mockContext as any)
    }catch(error) {
      expect(error.message).toEqual('No quantity provided.')
    }
  });

  it('should throw error if connected Prisma and Stripe item fields do not match', async () => {
    const mockContext = {
      prisma: {
        item: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: 1,
              title: 'Falafel'
            }
          ])
        }
      },
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue({
              data: [
                {
                  description: 'Falafel',
                  unitPrice: 400
                },
                {
                  description: 'Shawarma',
                  unitPrice: 600
                }
              ]
            })
          }
        }
      }
    };

    try{
      await fulfillOrder(mockSessionId, mockContext as any)
    }catch(error) {
      expect(error.message).toEqual('Original item length does not match with connected items.')
    }

  });

  it('should return an empty response if there are no line items retrieved from Stripe', async () => {
    const mockContext = {
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue({
              data: null
            })
          }
        }
      }
    };

    const response = await fulfillOrder(mockSessionId, mockContext as any);
    expect(response.length).toBe(0);
  });

  it('should throw an error if we cannot match Stripe titles to database titles', async () => {
    const mockContext = {
      prisma: {
        item: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: 1,
              title: 'Shawarma'
            }
          ])
        }
      },
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue({
              data: [
                {
                  description: 'Falafel',
                  unitPrice: 400,
                  quantity: 4
                }
              ]
            })
          }
        }
      }
    };

    try{
      await fulfillOrder(mockSessionId, mockContext as any)
    }catch(error) {
      expect(error.message).toEqual('Unable to match item titles.');
    }

  });

  it('should throw an error if the description field for a Stripe line item is empty', async () => {
    const mockContext = {
      stripe: {
        checkout: {
          sessions: {
            listLineItems: jest.fn().mockResolvedValue({
              data: [
                {
                  description: '',
                  unitPrice: 400
                },
                {
                  description: 'Falafel',
                  unitPrice: 600
                }
              ]
            })
          }
        }
      }
    };

    try{
      await fulfillOrder(mockSessionId, mockContext as any)
    }catch(error) {
      expect(error.message).toEqual('Blank item title provided by Stripe.');
    }

  });

})