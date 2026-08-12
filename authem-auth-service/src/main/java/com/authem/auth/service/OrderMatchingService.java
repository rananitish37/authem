package com.authem.auth.service;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.model.Ask;
import com.authem.auth.model.Bid;

public interface OrderMatchingService {
    TradeExecutionResponse placeBid(Long buyerId, PlaceBidRequest request);
    TradeExecutionResponse placeAsk(Long sellerId, PlaceAskRequest request);
    TradeExecutionResponse executeTrade(Bid bid, Ask ask);
}
